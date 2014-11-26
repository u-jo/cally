class WorkitemsController < ApplicationController

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
      total_work_time = calculate_total_time
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
      @workitem.update_attributes(:minutes_needed => params[:minutes_needed], 
                              :minutes_completed => params[:minutes_completed],
                              :due_date => params[:due_date],
                              :content => params[:content])
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


#returns total amortized work in minutes
  def totalwork
  	totaltime = calculate_total_time
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

    def calculate_total_time
      totaltime = 0
      current_user.workitems.each do |item|
        if item.active == true
          days_left = (item.due_date.to_date - Date.today).to_i
          time_needed = item.minutes_needed - item.minutes_completed
          if (days_left <= 0)
            totaltime += time_needed
          else 
            totaltime += time_needed / days_left
          end
        end
      end
      return totaltime
    end

end
