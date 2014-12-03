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

		def auth_user!
			if user_signed_in?
				super
			else
				redirect_to login_path
			## if you want render 404 page
			## render :file => File.join(Rails.root, 'public/404'), :formats => [:html], :status => 404, :layout => false
			end
		end

		
	    def calculate_total_time(for_day)
	      totaltime = 0
	      current_user.workitems.each do |item|
	        if (item.active == true || !item.work_logs.where("DATE(created_at) = ?", Date.today).first.nil?)
	          days_left = (item.due_date.to_date - for_day).to_i
	          time_needed = item.minutes_needed - past_work_completed(item)
	          if (days_left <= 0)
	            totaltime += time_needed
	          else 
	            totaltime += time_needed / days_left
	          end
	        end
	      end
	      return totaltime
	    end

	    def past_work_completed(work_item)
	      past_work = work_item.work_logs.where("DATE(created_at) < ?", Date.today)
	      past_time = past_work.inject(0) { |sum, work_log| sum + work_log.change_in_time }
	      return past_time
	    end

end
