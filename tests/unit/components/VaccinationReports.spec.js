import {
    fireEvent,
    render,
    screen
} from "@testing-library/vue";
import VaccinationReports from "@/components/VaccinationReports";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import axios from "axios";

const mockResponse = {
    diseases: [
        {
            name: "COVID19",
            count: 2,
            vaccines: [
                {
                    name: "Johnson&Johnson",
                    count: 1
                },
                {
                    name: "Pfizer",
                    count: 1
                }
            ]
        },
        {
            name: "COVID21",
            count: 1,
            vaccines: [
                {
                    name: "Razor light",
                    count: 1
                }
            ]
        },
        {
            name: "Flu",
            count: 1,
            vaccines: [
                {
                    name: "FluMax",
                    count: 1
                }
            ]
        }
    ]
}

describe("VaccinationReports test", () => {
    describe("when component is rendered", () => {
        it("should correctly send request", async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            axios.get.mockResolvedValue({data: mockResponse});

            render(VaccinationReports, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() {},
                    },
                },
            });

            expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/\/admin\/vaccinations\/report\?.+/))
        });
    });

    describe("when download button is clicked", () => {
        it("should correctly send request", async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            axios.get.mockResolvedValue({data: mockResponse});

            render(VaccinationReports, {
                global: {
                    plugins: [PrimeVue, ToastService],
                    directives: {
                        tooltip() {},
                    },
                },
            });

            await fireEvent.click(screen.getByText('Download'));
            expect(axios.get).toHaveBeenLastCalledWith(expect.stringMatching(/\/admin\/vaccinations\/report\/download\?.+/), { responseType: 'blob'})
        });
    });
});