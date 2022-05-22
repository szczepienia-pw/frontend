<template>
	<Card class="reports">
		<template #title>Aggregated vaccination data</template>
		<template #content>
			<Chart type="bar" :data="data" :options="options" />
		</template>
		<template #footer>
			<div class="row">
				<div class="item">
					<div class="label">Start date</div>
					<Calendar v-model="startDate" @date-select="getChartData" showIcon />
				</div>
				<div class="item">
					<div class="label">End date</div>
					<Calendar v-model="endDate" @date-select="getChartData" showIcon />
				</div>
				<Button label="Download" class="download" icon="pi pi-download" @click="downloadReport" />
			</div>
		</template>
	</Card>
</template>

<script setup>
import Chart from "primevue/chart";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import Card from "primevue/card";

import { onMounted, ref } from "vue";
import { downloadVaccinationReport, getVaccinationReport } from "@/services/api";
import { errorToast } from "@/services/helpers";
import { useToast } from "primevue/usetoast";
const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
const startDate = ref(lastMonth);
const endDate = ref(new Date());
const data = ref({});
const toast = useToast();

const colors = [
	"#0288D1",
	"#3ac793",
	"#D32F2F",
	"#ab2562",
	"#fe4f11",
	"#f4d730",
	"#79b7a0",
	"#fd3741",
	"#ced562",
	"#721e7f",
	"#ffd114",
	"#ca2847",
	"#ffc219",
	"#49619d",
	"#fcd82e",
	"#9b2b77",
	"#604791",
	"#ff6800",
	"#8ac38f",
	"#ffa61a",
	"#6ba1b7",
	"#72b5b1",
	"#5b9bae",
];

const getChartData = () => {
	getVaccinationReport(startDate.value.toISOString(), endDate.value.toISOString())
		.then((response) => {
			response = response.data.diseases;
			const vaccines = response.map((d, i) => d.vaccines.map((v) => ({ ...v, disease: i }))).flat();
			const emptyData = vaccines.map(() => 0);
			data.value = {
				labels: response.map((d) => d.name),
				datasets: vaccines.map((v, i) => ({
					type: "bar",
					label: v.name,
					data: emptyData.map((d, j) => (j == v.disease ? v.count : d)),
					backgroundColor: colors[i],
				})),
			};
		})
		.catch((err) => {
			console.error(err);
            errorToast(toast, "Could not fetch report data", err);
		});
};

onMounted(() => {
    getChartData();
});

const downloadReport = () => {
    downloadVaccinationReport(startDate.value.toISOString(), endDate.value.toISOString())
    .then(report => {
      const fileUrl = URL.createObjectURL(report.data);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'Vaccination report';
      link.click();
      URL.revokeObjectURL(link.href);
      link.remove();
    })
    .catch(err => {
      console.error(err);
      errorToast(toast, "Could not download report", err);
    })
};

const options = ref({
	plugins: {
		tooltips: {
			mode: "index",
			intersect: false,
		},
		legend: {
			labels: {
				color: "#495057",
			},
		},
	},
	scales: {
		x: {
			stacked: true,
			ticks: {
				color: "#495057",
			},
			grid: {
				color: "#ebedef",
			},
		},
		y: {
			stacked: true,
			ticks: {
				color: "#495057",
			},
			grid: {
				color: "#ebedef",
			},
		},
	},
});
</script>

<style lang="scss" scoped>
.p-card.reports {
	margin: 2rem;
	padding: 2rem;
	width: 80%;

	.row {
		display: flex;
		flex-direction: row;

		.item {
			&:not(:last-child) {
				margin-right: 3rem;
			}

			.label {
				margin-bottom: 0.5rem;
			}
		}
	}

    .download {
        height: 3rem;
        align-self: end;
    }
}
</style>
