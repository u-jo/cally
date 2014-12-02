class DashboardController < ApplicationController
	def new
		worklogs = WorkLog.where("DATE(created_at) = ?", Date.today)
		total_work = 0
		workitems_set = Set.new
		@tasks_worked = []
		worklogs.each do |worklog|
			total_work += worklog.change_in_time
			if (!workitems_set.include?(worklog.workitem_id))
				workitem = Workitem.find(worklog.workitem_id)
				workitems_set.add(worklog.workitem_id)
				@tasks_worked.push(workitem.content)

			end
		end
		@total_work = (total_work / 60.0).round(2)
	end

	def weekly_summary
		today = Date.today
		range = (today.wday..1)
		work_time_array = []
		event_time_array = []
		(range.first).downto(range.last).each do |day|
			worklogs = WorkLog.where("DATE(created_at) = ?", Date.today - (day - 1))
			work_time = 0
			
			worklogs.each do |work|
				work_time += work.change_in_time
			end
			
			work_time_array.push((work_time/60).round(2))
		end

		while (work_time_array.length < 7)
			work_time_array.push(0)
		end

		(0..6).each do |offset|
			day = Date.today.beginning_of_week + offset
			events = Event.where("date = ?", day)
			event_time = 0
			events.each do |event|
				event_time += event.end_time - event.start_time
			end
			event_time_array.push((event_time/60).round(2))
		end


		respond_to do |format|
			format.json {
				render :json => {
					work_time: work_time_array,
					event_time: event_time_array
				}
			}
		end
	end
end
