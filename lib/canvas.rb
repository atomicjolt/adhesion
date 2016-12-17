class Canvas

  IGNORE_PARAMS = :controller, :action, :format, :type

  def initialize(canvas_uri, authentication, refresh_token_options=nil)
    @per_page = 100
    @canvas_uri = UrlHelper.scheme_host(canvas_uri)
    @refresh_token_options = refresh_token_options
    if authentication.is_a?(String)
      @authentication = OpenStruct.new(token: authentication)
    else
      @authentication = authentication
    end
    if refresh_token_options.present?
      required_options = [:client_id, :client_secret, :redirect_uri, :refresh_token]
      extra_options = @refresh_token_options.keys - required_options
      raise InvalidRefreshOptionsException, "Invalid option(s) provided: #{extra_options.join(', ')}" unless extra_options.length == 0
      missing_options = required_options - @refresh_token_options.keys
      raise InvalidRefreshOptionsException, "Missing required option(s): #{missing_options.join(', ')}" unless missing_options.length == 0
    end
  end

  def headers(additional_headers = {})
    {
      "Authorization" => "Bearer #{@authentication.token}",
      "User-Agent" => "CanvasAPI Ruby"
    }.merge(additional_headers)
  end

  def full_url(api_url, use_api_prefix=true)
    if api_url[0...4] == 'http'
      api_url
    else
      if use_api_prefix
        "#{@canvas_uri}/api/v1/#{api_url}"
      else
        "#{@canvas_uri}/#{api_url}"
      end
    end
  end

  def api_put_request(api_url, payload, additional_headers = {})
    url = full_url(api_url)
    refreshably do
      HTTParty.put(url, headers: headers(additional_headers), body: payload)
    end
  end

  def api_post_request(api_url, payload, additional_headers = {})
    url = full_url(api_url)
    refreshably do
      HTTParty.post(url, headers: headers(additional_headers), body: payload)
    end
  end

  def api_get_request(api_url, additional_headers = {})
    url = full_url(api_url)
    refreshably do
      HTTParty.get(url, headers: headers(additional_headers))
    end
  end

  def api_delete_request(api_url, additional_headers = {})
    url = full_url(api_url)
    refreshably do
      HTTParty.delete(url, headers: headers(additional_headers))
    end
  end

  def api_get_all_request(api_url, additional_headers = {})
    connector = api_url.include?('?') ? '&' : '?'
    next_url = "#{api_url}#{connector}per_page=#{@per_page}"
    results = []
    while next_url do
      result = api_get_request(next_url, additional_headers)
      result.each{ |r| results << r }
      next_url = get_next_url(result.headers['link'])
    end
    results
  end

  def api_get_blocks_request(api_url, additional_headers = {})
    connector = api_url.include?('?') ? '&' : '?'
    next_url = "#{api_url}#{connector}per_page=#{@per_page}"
    while next_url do
      result = api_get_request(next_url, additional_headers)
      yield result
      next_url = get_next_url(result.headers['link'])
    end
  end

  def refreshably
    result = yield
    check_result(result)
  rescue Canvas::RefreshTokenRequired => ex
    raise ex if @refresh_token_options.blank?
    Authentication.transaction do
      authentication = get_authentication_lock
      if authentication.token == @authentication.token
        authentication.token = refresh_token
        authentication.save!
      end
      @authentication = authentication
    end
    retry
  end

  def get_authentication_lock
    Authentication.lock(true).find(@authentication.id)
  end

  def refresh_token
    payload = {
      grant_type: 'refresh_token'
    }.merge(@refresh_token_options)
    url = full_url("login/oauth2/token", false)
    result = HTTParty.post(url, headers: headers, body: payload)
    raise Canvas::RefreshTokenFailedException, api_error(result) unless [200, 201].include?(result.response.code.to_i)
    result['access_token']
  end

  def check_result(result)

    code = result.response.code.to_i

    return result if [200, 201].include?(code)

    if code == 401 && result.headers['www-authenticate'] == 'Bearer realm="canvas-lms"'
      raise Canvas::RefreshTokenRequired
    end

    raise Canvas::InvalidAPIRequestException, api_error(result)
  end

  def api_error(result)
    error = "Status: #{result.headers['status']} \n"
    error << "Http Response: #{result.response.code} \n"
    error << "Error: #{result['errors'] || result.response.message} \n"
  end

  def get_next_url(link)
    return nil if link.blank?
    if url = link.split(',').find{|l| l.split(";")[1].strip == 'rel="next"' }
      url.split(';')[0].gsub(/[\<\>\s]/, "")
    end
  end
# TODO: should we check to see if payload is JSON, else is 402?
  def proxy(type, params, payload = nil, get_all = false)

    additional_headers = {
      "Content-Type" => "application/json"
    }

    method = CanvasUrls.urls[type][:method]
    url = Canvas.canvas_url(type, params, payload)

    case method
    when 'GET'
      if block_given?
        api_get_blocks_request(url, additional_headers) do |result|
          yield result
        end
      elsif get_all
        api_get_all_request(url, additional_headers)
      else
        api_get_request(url, additional_headers)
      end
    when 'POST'
      api_post_request(url, payload, additional_headers)
    when 'PUT'
      api_put_request(url, payload, additional_headers)
    when 'DELETE'
      api_delete_request(url, additional_headers)
    else
      raise Canvas::InvalidAPIMethodRequestException "Invalid method type: #{method}"
    end

    rescue Canvas::InvalidAPIRequestException => ex
      error = ex.to_s
      error << "API Request Url: #{url} \n"
      error << "API Request Params: #{params} \n"
      error << "API Request Payload: #{payload} \n"
      new_ex = Canvas::InvalidAPIRequestFailedException.new(error)
      new_ex.set_backtrace(ex.backtrace)
      raise new_ex

  end

  # Ignore required params for specific calls. For example, the external tool calls
  # have required params "name, privacy_level, consumer_key, shared_secret". However, those
  # params are not required if the call specifies config_type: "by_xml".
  def self.ignore_required(type)
    [
      "CREATE_EXTERNAL_TOOL_COURSES",
      "CREATE_EXTERNAL_TOOL_ACCOUNTS"
    ].include?(type)
  end

  def self.canvas_url(type, params, payload = nil)
    endpoint = CanvasUrls.urls[type]
    parameters = endpoint[:parameters]

    # Make sure all required parameters are present
    missing = []
    if !self.ignore_required(type)
      # parsed_payload = !payload.nil? ? eval(payload) : eval("")

      parameters.find_all{|p| p["required"]}.map{|p| p["name"]}.each do |p|
        if p.include?("[") && p.include?("]")
          parts = p.split('[')
          parent = parts[0].to_sym
          child = parts[1].gsub("]", "").to_sym

          missing << p unless (params[parent].present? && params[parent][child].present?) ||
                              (payload.present? && payload[parent].present? && payload[parent][child].present?)
        else
          missing << p unless params[p.to_sym].present? || (payload.present? && !payload.is_a?(String) && parsed_payload[p.to_sym].present?)
        end
      end
    end

    if missing.length > 0
      raise Canvas::MissingRequiredParameterException, "Missing required parameter(s): #{missing.join(', ')}"
    end

    # Generate the uri. Only allow path parameters
    uri_proc = endpoint[:uri]
    path_parameters = parameters.find_all{|p| p["paramType"] == "path"}.map{|p| p["name"].to_sym}
    args = params.slice(*path_parameters).symbolize_keys
    uri = args.blank? ? uri_proc.call : uri_proc.call(**args)

    # Generate the query string
    query_parameters = parameters.find_all{|p| p["paramType"] == "query"}.map{|p| p["name"].to_sym}

    # always allow paging parameters
    query_parameters << :per_page
    query_parameters << :page

    allowed_params = params.slice(*query_parameters)

    if allowed_params.present?
      "#{uri}?#{allowed_params.to_query}"
    else
      uri
    end

  end


  #
  # Helper methods
  #

  # Get all accounts including sub accounts
  def all_accounts
    all = []
    self.proxy("LIST_ACCOUNTS", {}, nil, true).each do |account|
      all << account
      sub_accounts = self.proxy("GET_SUB_ACCOUNTS_OF_ACCOUNT", {account_id: account['id']}, nil, true)
      all = all.concat(sub_accounts)
    end
    all
  end


  #
  # Exceptions
  #

  class RefreshTokenRequired < Exception
  end

  class InvalidRefreshOptionsException < Exception
  end

  class RefreshTokenFailedException < Exception
  end

  class InvalidAPIRequestException < Exception
  end

  class InvalidAPIRequestFailedException < Exception
  end

  class InvalidAPIMethodRequestException < Exception
  end

  class MissingRequiredParameterException < Exception
  end

end
