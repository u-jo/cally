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
  end

  def show
    if (user_signed_in?)
      workitems = current_user.workitems.order(:due_date)
      respond_to do |format| 
        format.json {
          render :json => current_user.workitems
        }
      end
    end
  end


#returns total amortized work in minutes
  def totalwork
  	totaltime = 0
  	current_user.workitems.each do |item|
  		if item.active == true
        puts totaltime
  			totaltime += (item.minutes_needed-item.minutes_completed)/(item.due_date.to_date-Date.today).to_i
  		end
  	end

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



end
