class CustomDomain
  def matches?(request)
    return false if request.subdomain.length <= 0 || request.subdomain == "www"
    true
  end
end

Rails.application.routes.draw do
  root to: "home#index"

  get "iframe_cookies_fix_redirect" => "lti_launches#iframe_cookies_fix_redirect"
  get "relaunch_lti_tool" => "lti_launches#relaunch_lti_tool"

  resources :lti_launches do
    collection do
      post :index
      get :index
    end
  end

  match "scorm_courses/postback" => "scorm_courses#postback", :via => :post
  resources :scorm_courses

  devise_for :users, controllers: {
    sessions: "sessions",
    registrations: "registrations",
    omniauth_callbacks: "omniauth_callbacks",
  }

  as :user do
    get     "/auth/failure"         => "sessions#new"
    get     "users/auth/:provider"  => "users/omniauth_callbacks#passthru"
    get     "sign_in"               => "sessions#new"
    post    "sign_in"               => "sessions#create"
    get     "sign_up"               => "devise/registrations#new"
    delete  "sign_out"              => "sessions#destroy"
  end

  resources :users
  resources :download_status, only: [:index]

  namespace :admin do
    root to: "home#index"
  end

  resources :courses, only: [] do
    resources :exports, only: [] do
      get "attendances", on: :collection
    end
  end

  namespace :api do
    get "proctor_login" => "proctor_login#signed_url"
    get "proctored_exams" => "proctored_exams#start_proctored_exam"
    resources :jwts
    resources :canvas_accounts
    resources :oauths
    resources :courses, only: [] do
      resources :students, only: [:index]
      resources :sections, only: [] do
        resources :students, only: [:index]
      end
    end

    resources :applications do
      resources :application_instances
    end

    resources :canvas_accounts, only: [:index]

    resources :testing_centers_accounts
    resources :scorm_courses do
      get "launch" => "scorm_courses#launch"
      get "preview" => "scorm_courses#preview"
      post "import" => "scorm_courses#import"
      resources :students, only: [:index]
      resources :sections, only: [] do
        resources :students, only: [:index]
      end
    end
    resources :exam_requests
    resources :proctor_codes
    resources :courses do
      resources :attendances, only: [:index, :create, :update] do
        get "search", on: :collection
      end
    end

    resources :quiz_conversions, only: [:create]
    resources :sites
  end

  mount MailPreview => "mail_view" if Rails.env.development?

  get "api/canvas" => "api/canvas_proxy#proxy"
  post "api/canvas" => "api/canvas_proxy#proxy"
  put "api/canvas" => "api/canvas_proxy#proxy"
  delete "api/canvas" => "api/canvas_proxy#proxy"
end
