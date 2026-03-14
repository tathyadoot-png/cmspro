"use client";

export default function PerformanceLeaderboard({data}:any){

  return(

    <div className="bg-card p-6 rounded-xl">

      <h2 className="font-semibold mb-4">
        Team Leaderboard
      </h2>

      <div className="space-y-3">

        {data.map((user:any,index:number)=>(

          <div
            key={user._id}
            className="flex justify-between text-sm"
          >

            <span>
              #{index+1} {user.userId?.name}
            </span>

            <span className="font-semibold">
              {user.performanceScore}
            </span>

          </div>

        ))}

      </div>

    </div>

  );

}