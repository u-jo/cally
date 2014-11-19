class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception
	before_filter :set_csrf_cookie_for_ng
	before_filter :authenticate_user!
	def after_sign_in_path_for(resource)
		request.env['omniauth.origin'] || stored_location_for(resource) || root_path
	end

	def set_csrf_cookie_for_ng
	  cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
	end

	protected
		def verified_request?
			super || form_authenticity_token == request.headers['X-XSRF-TOKEN']
		end
end
