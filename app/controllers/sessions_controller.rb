# customize session controller
class SessionsController < Devise::SessionsController
	include ApplicationHelper
  	def create
  		puts auth_options
  		# self.resource = warden.authenticate!(auth_options)
	   #  sign_in(resource_name, resource)
	   #  if !session[:return_to].blank?
	   #    redirect_to session[:return_to]
	   #    session[:return_to] = nil
	   #  else
	   #    respond_with resource, :location => after_sign_in_path_for(resource)
	   #  end
  	end

  	def destroy
  		super
  	end
end