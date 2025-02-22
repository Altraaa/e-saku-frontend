import { Form, FormInput, FormButton } from "@/components/ui/form";
import { ArrowRight } from "lucide-react";

const ViewESakuForm = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logika untuk login di sini
    };
    return (
        <>
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
                      <div className="flex gap-12 ">
                          <div className="flex flex-col gap-3 w-1/2">
                              <FormInput
                                  id="studentname"
                                  label="Student Name"
                                  type="text"
                                  placeholder=""
                              />
                          </div>
                          <div className="flex flex-col gap-3 w-1/2">
                              <FormInput
                                  id="kelas"
                                  label="Class"
                                  type="text"
                                  placeholder=""
                              />
                          </div>
                      </div>

                      <div className="flex gap-12 justify-center items-center text-base ">
                          <div className="flex flex-col w-1/2 gap-1">
                            <label htmlFor="inputtype" className="text-lg font-semibold ">Input</label>
                              <select name="inputtype" id="inputtype" className="border p-1 rounded-md shadow-sm">
                                <option value="violation">Pelanggaran</option>
                                <option value="accomplishment">Prestasi</option>
                              </select>
                          </div>
                          <div className="flex flex-col gap-3 w-1/2">
                              <FormInput
                                  id="date"
                                  label="Date"
                                  type="text"
                                  placeholder=""
                              />
                          </div>
                      </div>
                      <div className="flex gap-12 ">
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
                                  placeholder=""
                              />
                          </div>
                      </div>
                      <div className="flex gap-12 hidden">
                          <div className="flex flex-col gap-3 w-4/5">
                              <FormInput
                                  id="achievmentlevel"
                                  label="Achievment Level"
                                  type="text"
                                  placeholder=""
                              />
                          </div>
                          <div className="flex flex-col gap-3 w-1/5">
                              <FormInput
                                  id="point"
                                  label="Point"
                                  type="text"
                                  placeholder=""
                              />
                          </div>
                      </div>
                      <FormInput
                          id="adddescription"
                          label="Add Description"
                          type="text"
                          placeholder=""
                      />
                      <div className="w-1/3 ">
                          <FormInput
                              id="selectfollowup"
                              label="Select Follow Up"
                              type="text"
                              placeholder=""
                          />
                      </div>
                      <div className="">
                        <FormInput
                            id="addfollowupdescription"
                            label="Add Follow Up Description"
                            type="text"
                            placeholder=""
                        />
                      </div>
                      
                      <div className="flex justify-end gap-3">
                          <div className="w-32 flex">
                              <FormButton>Add Data</FormButton>
                          </div>
                      </div>
                  </Form>
                </div>
            </div>
        </>
    );
};

export default ViewESakuForm;
