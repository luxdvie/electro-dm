import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ColorPickerModule } from "ngx-color-picker";
import { AnimationLayerComponent } from "./animation-layer/animation-layer.component";
import { DeviceComponent } from "./device/device.component";
import { LedStripComponent } from "./led-strip/led-strip.component";
import { LEDComponent } from "./led/led.component";

const routes: Routes = [
	{
		path: "",
		component: DeviceComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		ColorPickerModule,
		FormsModule,
		RouterModule.forChild(routes),
	],
	declarations: [
		LEDComponent,
		LedStripComponent,
		AnimationLayerComponent,
		DeviceComponent,
	],
})
export class LedModule {}
