import ProjectCard from "./ProjectCard";

function ProjectGrid({projects}) {


  return (
    // grid-cols-[repeat(auto-fit,minmax(158px,1fr))]
    <div className="grid grid-cols-3 gap-3 p-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}

export default ProjectGrid;
