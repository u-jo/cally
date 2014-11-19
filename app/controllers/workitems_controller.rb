class WorkitemsController < ApplicationController
  def new
  end  



  def create
    @workitem = current_user.workitems.build(workitem_params)
    return @workitem.to_json

  end




  def destroy
  end


  def active 

  end



  private

    def workitem_params
      params.require(:workitem).permit(:content)
    end
end



end
