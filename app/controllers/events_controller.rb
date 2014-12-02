class EventsController < ApplicationController
	def create 

		@event = current_user.events.build(event_params)
		respond_to do |format| 
			if (@event.save)
				format.json {
					render :json => @event
				}
			else

			end
		end
	end

	def show
		events = current_user.events
		respond_to do |format|
			format.json {
				render :json => events
			}
		end
	end

	def update
		@event = Event.where(id: params[:id]).first
		if (!@event.nil?)
			@event.update_attributes(:start_time => params[:start_time],
									:end_time => params[:end_time],
									:name => params[:name],
									:date => params[:date])
			respond_to do |format| 
				format.json {
				  render :json => @event
				}
			end
		end
		
	end

	def destroy
		@event = Event.find(params[:id])
		if (@event.destroy)
			respond_to do |format|
				format.json {
					render :json => {
						:status => 200
					}
				}
			end
		end
	end

	private 
		def event_params
			params.require(:event).permit(:name, :date, :start_time, :end_time)
		end
end
