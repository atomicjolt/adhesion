module EncryptionSupport
  extend ActiveSupport::Concern

  protected

  def decode_hex(str)
    @bytes ||= str.scan(/../).map { |x| x.hex.chr }.join
  end
end
