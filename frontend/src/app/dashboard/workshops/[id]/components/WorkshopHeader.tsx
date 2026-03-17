export default function WorkshopHeader({ workshop }: any) {

  return (

    <div className="flex justify-between items-center">

      <div>

        <h1 className="text-2xl font-bold">
          {workshop.workshopName}
        </h1>

        <p className="text-sm text-gray-500">
          {workshop.workshopCode}
        </p>

      </div>

      <div>

        <span className="text-sm">
          Status: {workshop.status}
        </span>

      </div>

    </div>

  );

}