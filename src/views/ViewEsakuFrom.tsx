import { Form, FormInput, FormButton, FormSelect, FormTextarea } from "@/components/ui/form";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const ViewESakuForm = () => {
    const [inputType, setInputType] = useState("violation");
    const [classType, setClassType] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
      <div className="m-1">
        <div className="flex justify-end mb-5">
          <a
            href=""
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-sm text-xl text-right flex gap-3 items-center"
          >
            Send as Report <ArrowRight className="w-" />
          </a>
        </div>
        <div className="shadow-md bg-white border p-8 mt-5 flex flex-col gap-4 rounded-md max-h-full overflow-y-auto">
          <Form onSubmit={handleSubmit}>
            <div className="flex gap-12">
              <div className="flex flex-col gap-3 w-1/2">
                {/*ini auto select input*/}
                <FormInput
                  id="studentname"
                  label="Student Name"
                  type="text"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col gap-3 w-1/2">
                {/*ini auto select input*/}
                <FormSelect
                  id="class"
                  label="Select Class"
                  placeholder="Select Class"
                  value={classType}
                  onChange={(value) => setClassType(value)}
                  options={[
                    { value: "violation", label: "Pelanggaran" },
                    { value: "accomplishment", label: "Prestasi" },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-12 justify-center items-center text-base">
              <div className="flex flex-col w-1/2 gap-1">
                <FormSelect
                  id="inputtype"
                  label="Input"
                  value={inputType}
                  onChange={(value) => setInputType(value)}
                  options={[
                    { value: "violation", label: "Pelanggaran" },
                    { value: "accomplishment", label: "Prestasi" },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-3 w-1/2">
                <FormInput id="date" label="Date" type="date" placeholder="" />
              </div>
            </div>

            {inputType === "violation" ? (
              <div className="flex gap-12">
                <div className="flex flex-col gap-3 w-4/5">
                  <FormInput
                    id="typeofviolation"
                    label="Type of Violations"
                    type="text"
                    placeholder=""
                  />
                </div>
                <div className="flex flex-col gap-3 w-1/5">
                  <FormInput
                    id="point"
                    label="Point"
                    type="text"
                    placeholder="Violation Point"
                    disabled
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-12">
                <div className="flex flex-col gap-3 w-4/5">
                  <FormInput
                    id="achievment"
                    label="Achievement"
                    type="text"
                    placeholder="Acvihevment"
                  />
                </div>
                <div className="flex flex-col gap-3 w-1/5">
                  <FormInput
                    id="point"
                    label="Point"
                    type="text"
                    placeholder="Achivment Point"
                    disabled
                  />
                </div>
              </div>
            )}

            <FormTextarea
              id="adddescription"
              label="Add Description"
              placeholder=""
            />

            <div className="w-1/3">
              <FormSelect
                id="inputtype"
                label="Follow Up"
                value={inputType}
                onChange={(value) => setInputType(value)}
                options={[
                  { value: "violation", label: "Pelanggaran" },
                  { value: "accomplishment", label: "Prestasi" },
                ]}
              />
            </div>

            <FormTextarea
              id="addfollowupdescription"
              label="Add Follow Up Description"
              placeholder=""
            />

            <div className="flex justify-end gap-3">
              <div className="w-32 flex">
                <FormButton>Add Data</FormButton>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
};

export default ViewESakuForm;
