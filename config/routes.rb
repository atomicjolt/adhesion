Rails.application.routes.draw do
  root to: "home#index"

  get "iframe_cookies_fix_redirect" => "lti_launches#iframe_cookies_fix_redirect"
  get "relaunch_lti_tool" => "lti_launches#relaunch_lti_tool"

  resources :jwks
  resources :public_keys
  resource :lti_config

  resources :lti_dynamic_registrations
  resources :lti_launches do
    collection do
      post :index
      get :launch
      get :init
      post :init
    end
    member do
      post :show
    end
  end

  match "scorm_courses/postback" => "scorm_courses#postback", :via => :post

  resources :scorm_courses
  resources :lti_deployments

  devise_for :users, controllers: {
    sessions: "sessions",
    registrations: "registrations",
    omniauth_callbacks: "omniauth_callbacks",
  }, skip: [:registrations]

  as :user do
    get     "/auth/failure"         => "sessions#new"
    get     "users/auth/:provider"  => "users/omniauth_callbacks#passthru"
    get     "sign_in"               => "sessions#new"
    post    "sign_in"               => "sessions#create"
    delete  "sign_out"              => "sessions#destroy"
    get     "sign_out"              => "sessions#destroy"
    get "users/edit" => "devise/registrations#edit", as: "edit_user_registration"
    put "users" => "devise/registrations#update", as: "user_registration"
  end

  resource :two_factor_settings, except: [:index, :show]

  resources :users
  resources :download_status, only: [:index]

  namespace :admin do
    root to: "home#index"
  end

  resources :exports, only: [] do
    get "export_exams_as_csv" => "exports#export_exams_as_csv", on: :collection
  end

  resources :courses, only: [] do
    resources :exports, only: [] do
      get "attendances", on: :collection
    end
  end

  namespace :api do
    get "proctor_login" => "proctor_login#signed_url"
    get "proctored_exams" => "proctored_exams#start_proctored_exam"
    resources :proctored_exams, only: [:update]
    post "proctor_conversations" => "proctor_conversations#initiate_conversation"
    resources :jwts
    resources :oauths
    resources :courses, only: [] do
      resources :students, only: [:index]
      resources :sections, only: [] do
        resources :students, only: [:index]
      end
    end

    resources :applications do
      resources :application_instances do
        member do
          get :check_auth
        end
      end
      resources :lti_install_keys
    end

    resources :application_instances do
      resources :lti_deployments
    end

    resources :canvas_accounts, only: [:index]
    # This endpoint provides access to users belonging to the Canvas account associated with the LTI launch.
    resources :canvas_account_users, only: [:index, :show, :update]

    resources :testing_centers_accounts
    resources :scorm_courses do
      get "course_report" => "scorm_courses#course_report"
      get "activity_report" => "scorm_courses#activity_report"
      get "launch" => "scorm_courses#launch"
      get "preview" => "scorm_courses#preview"
      get "status" => "scorm_courses#status"
      post "import" => "scorm_courses#import"
      post "replace" => "scorm_courses#replace"
      resources :students, only: [:index]
      resources :sections, only: [] do
        resources :students, only: [:index]
      end
    end
    resources :exam_requests
    resources :courses do
      resources :attendances, only: [:index, :create, :update] do
        get "search", on: :collection
      end
    end

    resources :quiz_conversions, only: [:create]
    resources :sites
    resources :submissions
    resources :course_completions
    resources :section_metadata
    resources :lti_content_item_selection, only: [:create]
    resources :lti_deep_link_jwt, only: [:create]
    resources :lti_launches

    resources :ims_exports do
      member do
        get :status
      end
    end
    resources :ims_imports, only: [:create]
    resources :account_analytics, only: [:index]

    resources :sis_grades, only: [:index]

    resources :atomic_docs, only: [] do
      collection do
        post :documents
        post :sessions
        delete "documents/:id", to: "atomic_docs#destroy", as: :destroy
        get "sessions/:id", to: "atomic_docs#session_status", as: :session_status
        get "sessions/:id/view", to: "atomic_docs#view", as: :view
        get "sessions/:id/file/file.pdf", to: "atomic_docs#pdf_file", as: :pdf_file
      end
    end
  end

  get "api/canvas" => "api/canvas_proxy#proxy"
  post "api/canvas" => "api/canvas_proxy#proxy"
  put "api/canvas" => "api/canvas_proxy#proxy"
  delete "api/canvas" => "api/canvas_proxy#proxy"

  # handle routing errors
  match "*path", to: "application#routing_error", via: :all
end
