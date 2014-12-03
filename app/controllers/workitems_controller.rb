class WorkitemsController < ApplicationController
  MINUTES_PER_DAY = 24 * 60

  def new
  end  

  def create
    @workitem = current_user.workitems.build(workitem_params)
    if (@workitem.save) 
      respond_to do |format| 
        format.json {
          render :json => @workitem
        }
      end
    end
  end


  def destroy
    @workitem.destroy
  end


  def deactivate
    @workitem = Workitem.where(id: params[:id]).first
    if (!@workitem.nil?)
      @workitem.update_attribute(:active, false)
      total_work_time = calculate_total_time(Date.today)
      respond_to do |format| 
        format.json {
          render :json => {
            total_work_time: total_work_time
          }
        }
      end
    else
      respond_to do |format| 
        format.json {
          render :status => 500
        }
      end
    end
  end 


  def update
    @workitem = Workitem.where(id: params[:id]).first
    if (!@workitem.nil?) 
      time_needed_before = @workitem.minutes_needed
      time_needed_now = params[:minutes_completed]

      if (time_needed_before != time_needed_now)
        time_diff = time_needed_now - time_needed_before

      end
      @workitem.update_attributes(:minutes_needed => params[:minutes_needed], 
                              :minutes_completed => params[:minutes_completed],
                              :due_date => params[:due_date],
                              :content => params[:content])
      @work_log = @workitem.work_logs.build(work_log_params)
      @work_log.save
      respond_to do |format| 
        format.json {
          render :json => @workitem
        }
      end
    else
      respond_to do |format| 
        format.json {
          render :status => 404
        }
      end
    end
  end 

  def weekly_status
    today = Date.today
    total_sleep = total_work = total_leisure = 0
    work_array = []
    (1..today.wday).each do |i|
      day = today - (i - 1)
      work_time = calculate_total_time(day)
      work_array.push(work_time)
    end

    respond_to do |format|
      format.json {
        render :json => {
          work_data: work_array
        }
      }
    end
  end


  def show
    if (user_signed_in?)
      workitems = current_user.workitems.where(active: true)
      workitems = workitems.sort_by { |workitem| workitem.due_date }
      respond_to do |format| 
        format.json {
          render :json => workitems
        }
      end
    end
  end

  def events_today 
    events_today = current_user.events.where(date: Time.now.to_date)
    respond_to do |format| 
      format.json {
        render :json => events_today
      }
    end
  end


#returns total amortized work in minutes
  def totalwork
  	totaltime = calculate_total_time(Date.today)
    respond_to do |format|
      format.json {
        render :json =>{ :totaltime => totaltime }
      }
    end
  end

# Calculating daily work, sleep and leisure for progress bar - 

# if totalworkhours > 24: sleep = 0 and leisure = 0
# else if 16 < totalworkhours < 24: sleep = 24 - totalworkhours, leisure = 0
# else: sleep = 8, leisure = 16-totalworkhours

 private
    def workitem_params
      params.require(:workitem).permit(:content, :minutes_needed, :minutes_completed, :due_date, :active)
    end

    def work_log_params
      params.require(:work_log).permit(:change_in_time)
    end

    def calculate_total_time(for_day)
      totaltime = 0
      current_user.workitems.each do |item|
        if item.active == true
          days_left = (item.due_date.to_date - for_day).to_i
          time_needed = item.minutes_needed - past_work_completed(item)
          puts "YESSS"
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
