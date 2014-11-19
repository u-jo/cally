class RegistrationsController < Devise::RegistrationsController

	before_filter :configure_permitted_parameters

  
	# app/controllers/registrations_controller.rb
	def new
		super
	end

	def create
		# add custom create logic here
		@user = User.new sign_up_params
		if (@user.save) 
			flash[:sucess] = "Welcome" #<- here
		end

		sign_in @user
		redirect_to :root
	end

	def update
		super
	end

	protected
		def configure_permitted_parameters
			devise_parameter_sanitizer.for(:sign_up).push(:name)
		end

end
