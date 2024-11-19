function ProjectCard({ imageUrl, title, description }) {
    return (
        <div className="flex flex-col gap-3 pb-3">
          <img
            src={imageUrl}
            alt={title}
            className="w-full aspect-square object-cover rounded-xl shadow"
          />
          <div class="px-2">
            <p className="text-base opacity-80 leading-normal font-semibold">{title}</p>
            <p className="text-opacity-25 opacity-70  text-sm font-medium leading-normal">{description}</p>
          </div>
        </div>
      );
}

export default ProjectCard;
