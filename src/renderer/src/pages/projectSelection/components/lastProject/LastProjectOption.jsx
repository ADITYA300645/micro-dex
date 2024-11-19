function LastProjectOption() {
    return (
        <div>
            <h2 className="text-xl font-bold mx-4 mt-6">
                Latest Projects
            </h2>
            <div className="w-full h-96 flex justify-center items-center my-4 rounded-xl">
                <img 
                    src="https://picsum.photos/1200/800" 
                    alt="Project background"
                    className="w-full h-96 object-cover overflow-hidden mx-4 rounded-xl"
                />
                
            </div>
        </div>
    );
}

export default LastProjectOption;