import Link from "next/link";

const LocationPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block mr-1 text-gray-500"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

async function getSchools() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/schools`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch schools");
  }
  return res.json();
}

export default async function ShowSchoolsPage() {
  const schools = await getSchools();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-300 to-purple-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Schools
          </h1>
          <Link
            href="/add-school"
            className="bg-indigo-600 text-white py-2 px-5 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            + Add School
          </Link>
        </div>

        {schools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {schools.map((school) => (
              <div
                key={school.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/50 transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={school.image}
                    alt={school.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h2
                    className="text-xl font-bold text-gray-800 truncate"
                    title={school.name}
                  >
                    {school.name}
                  </h2>

                  <div className="mt-2 flex items-center text-gray-600">
                    <LocationPinIcon />
                    <p className="truncate" title={school.address}>
                      {school.address}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 ml-5">
                    {school.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-600">
              No Schools Found
            </h2>
            <p className="text-gray-500 mt-2">
              Get started by adding a new school!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
