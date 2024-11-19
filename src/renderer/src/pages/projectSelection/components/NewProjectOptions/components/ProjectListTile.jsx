import { ArrowRight } from 'lucide-solid';

const ProjectListTile = ({ title, subtitle, Icon,onClick }) => {
    return (
        <div className="mx-4 my-1">
            <div className="group cursor-pointer rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={onClick}>
                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-200 p-2 rounded-md opacity-70 dark:bg-gray-700 dark:opacity-100
                                    transition-all duration-300
                                    group-hover:bg-blue-100 group-hover:dark:bg-blue-900
                                    group-hover:opacity-100">
                            {Icon && <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300
                                                   group-hover:text-blue-600 dark:group-hover:text-blue-400" />}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100
                                      group-hover:text-blue-600 dark:group-hover:text-blue-400
                                      transition-colors duration-300">
                                {title}
                            </p>
                            <p className="text-gray-500 text-sm
                                      group-hover:text-blue-500 dark:group-hover:text-blue-300
                                      transition-colors duration-300">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                    <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="w-5 h-5 text-gray-400 
                                           group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectListTile;