import JobCard, { type Job } from "./JobCard";

const allJobs: Job[] = [
  { id: 1, title: "Supply Chain Coordinator", location: "Houston, TX", country: "United States", department: "Operations", type: "Full-Time", date: "03/05/2026" },
  { id: 2, title: "Digital Marketing Manager", location: "Mexico City", country: "Mexico", department: "Marketing", type: "Full-Time", date: "03/03/2026" },
  { id: 3, title: "Software Engineer – Backend", location: "Toronto, ON", country: "Canada", department: "Engineering", type: "Full-Time", date: "03/01/2026" },
  { id: 4, title: "Financial Analyst", location: "São Paulo", country: "Brazil", department: "Finance", type: "Full-Time", date: "02/28/2026" },
  { id: 5, title: "Process Engineer", location: "Monterrey", country: "Mexico", department: "Engineering", type: "Full-Time", date: "02/25/2026" },
  { id: 6, title: "HR Business Partner", location: "Chicago, IL", country: "United States", department: "Human Resources", type: "Full-Time", date: "02/24/2026" },
  { id: 7, title: "Front-End Developer", location: "London", country: "United Kingdom", department: "Engineering", type: "Contract", date: "02/22/2026" },
  { id: 8, title: "Customer Service Representative", location: "Guadalajara", country: "Mexico", department: "Operations", type: "Full-Time", date: "02/20/2026" },
  { id: 9, title: "Data Science Intern", location: "Austin, TX", country: "United States", department: "Engineering", type: "Internship", date: "02/18/2026" },
  { id: 10, title: "Logistics Supervisor", location: "Vancouver, BC", country: "Canada", department: "Operations", type: "Full-Time", date: "02/15/2026" },
  { id: 11, title: "Brand Strategist", location: "New York, NY", country: "United States", department: "Marketing", type: "Full-Time", date: "02/13/2026" },
  { id: 12, title: "Quality Assurance Analyst", location: "Calgary, AB", country: "Canada", department: "Engineering", type: "Part-Time", date: "02/10/2026" },
];

interface JobListProps {
  keyword: string;
  location: string;
  filters: Record<string, string[]>;
}

const JobList = ({ keyword, location, filters }: JobListProps) => {
  const filtered = allJobs.filter((job) => {
    const kw = keyword.toLowerCase();
    const loc = location.toLowerCase();
    const matchesKeyword = !kw || job.title.toLowerCase().includes(kw) || job.department.toLowerCase().includes(kw);
    const matchesLocation = !loc || job.location.toLowerCase().includes(loc) || job.country.toLowerCase().includes(loc);
    const matchesCountry = !filters.Country?.length || filters.Country.includes(job.country);
    const matchesDept = !filters.Department?.length || filters.Department.includes(job.department);
    const matchesType = !filters["Job Type"]?.length || filters["Job Type"].includes(job.type);
    return matchesKeyword && matchesLocation && matchesCountry && matchesDept && matchesType;
  });

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-4">
        Current Openings
        <span className="text-sm font-normal text-muted-foreground ml-2">
          ({filtered.length} {filtered.length === 1 ? "position" : "positions"})
        </span>
      </h2>
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No positions found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
