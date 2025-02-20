import { ChevronRight, CircleHelp } from "lucide-react";
import { useState } from "react";


const ViewHelp = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleFAQ = () => {
        setIsOpen(!isOpen);
      };

    return (
      <>
        <div className="flex justify-between gap-10">
            <div className="flex flex-col w-full pl-2">
                <h1 className="text-xl font-semibold">Frequently Asked Questions (FAQ)</h1>
                <p>These are the most commonly asked questions about E-Saku</p>
                <div id="faq-title" className="flex flex-col items-start pt-5">
                    <div className="flex w-full items-center" onClick={toggleFAQ}>
                        <div className="flex items-center justify-center p-2.5 mr-4 border-gray-500 rounded border">
                            <CircleHelp className="text-gray-600 opacity-70"/>
                        </div>
                        <div className="flex w-full font-semibold">
                            <h3>What is E-Saku?</h3>
                        </div>
                        <div className="flex w-1/4 items-center justify-end">
                            <ChevronRight className={` ${isOpen ? 'transform rotate-90' : ''}`} />
                        </div>
                    </div>
                    {isOpen && (
                        <div id="faq-desc" className="flex max-w-max justify-start pl-[60px] pt-2">
                            <p className="opacity-70">
                            E-Saku is a digital platform used by schools to track, monitor, and manage students' achievements and disciplinary records. With e-Saku, teachers, students, and parents can monitor academic progress and student behavior transparently.
                            </p>
                        </div>
                    )}
                </div>
                
                
            </div>
            <div className="flex flex-col w-full pl-2">
                <h1 className="text-xl font-semibold">Privacy Policy</h1>
                <p>Here is the privacy policy of the E-Saku website</p>
                <div className="flex items-center pt-5">
                    <div className="flex items-center justify-center p-2.5 mr-4 border-gray-400 rounded border">
                        <CircleHelp className="text-gray-500 opacity-50"/>
                    </div>
                    <div className="flex w-full">
                        <h3>Information We Collect</h3>
                    </div>
                    <div className="flex w-1/4 items-center justify-start">
                        <ChevronRight/>
                    </div>
                </div>
            </div>
        </div>
      </>
    );
  };
  
export default ViewHelp;  