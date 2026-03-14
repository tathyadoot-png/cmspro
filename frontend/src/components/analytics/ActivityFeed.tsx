"use client";

export default function ActivityFeed({activities}:any){

  return(

    <div className="bg-card p-6 rounded-xl">

      <h2 className="font-semibold mb-4">
        Recent Activity
      </h2>

      <div className="space-y-2 text-sm">

        {activities.map((a:any)=>(
          <div key={a._id}>
            {a.userId?.name} - {a.actionType}
          </div>
        ))}

      </div>

    </div>

  );

}