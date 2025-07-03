import { cover } from "../assets";
import Button from "../components/Button";

const HeroSection = () => {
    return (
        <section
            className="w-full py-20 bg-cover bg-no-repeat relative mt-12"
            style={{
                backgroundImage: `url(${cover})`,
            }}
        >
            {/* Optional overlay for better contrast */}
            <div className="absolute inset-0 bg-black/50 z-0" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative z-10">
                <div className="text-white">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Remarkably Cleaner. <br /> Amazingly Simpler.
                    </h1>
                    <p className="mt-4 text-lg max-w-md">
                        Providing spotless cleaning services for busy people since 2035. Always on time, always smiling.
                    </p>
                    <div className="mt-6">
                        <Button variant="primary">
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;