"use client";

export default function BurnoutPanel({data}:any){

  return(

    <div className="bg-card p-6 rounded-xl">

      <h2 className="font-semibold mb-4">
        Burnout Risk
      </h2>

      <div className="space-y-2">

        {data.map((user:any)=>(
          <div
            key={user.userId}
            className="flex justify-between"
          >
            <span>{user.name}</span>

            <span
              className={
                user.burnoutRisk === "HIGH"
                  ? "text-red-500"
                  : user.burnoutRisk === "MEDIUM"
                  ? "text-yellow-500"
                  : "text-green-500"
              }
            >
              {user.burnoutRisk}
            </span>

          </div>
        ))}

      </div>

    </div>

  );

}