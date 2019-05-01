Rails.application.routes.draw do
  root to: "home#index"

  get "iframe_cookies_fix_redirect" => "lti_launches#iframe_cookies_fix_redirect"
  get "relaunch_lti_tool" => "lti_launches#relaunch_lti_tool"

  resources :lti_launches do
    collection do
      post :index
      get :launch
    end
    member do
      post :show
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
    get     "sign_out"              => "sessions#destroy"
  end

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
    resources :canvas_accounts
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
    end

    resources :canvas_accounts, only: [:index]

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
    resources :lti_launches

    resources :ims_exports do
      member do
        get :status
      end
    end
    resources :ims_imports, only: [:create]

    resources :sis_grades, only: [:index]

    resources :atomic_docs, only: [] do
      collection do
        post :documents
        post :sessions
        get "sessions/:id/view", to: "atomic_docs#view"
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
