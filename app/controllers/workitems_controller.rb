class WorkitemsController < ApplicationController
  def new
  end  

  def create
    @workitem = current_user.workitems.build(workitem_params)
    return @workitem.to_json

  end


  def destroy
  end


#returns total amortized work in minutes
  def totalwork
  	totaltime = 0
  	current_user.workitems.each do |item|
  		if item.active == true
  			totaltime += (item.minutes_needed-item.minutes_completed)/(item.due_date.to_date-Date.today).to_i
  		end
  	end
  	return totaltime
  end

# Calculating daily work, sleep and leisure for progress bar - 

# if totalworkhours > 24: sleep = 0 and leisure = 0
# else if 16 < totalworkhours < 24: sleep = 24 - totalworkhours, leisure = 0
# else: sleep = 8, leisure = 16-totalworkhours


 private

    def workitem_params
      params.require(:workitem).permit(:content)
    end
end



end
