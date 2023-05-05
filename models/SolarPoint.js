const mongoose = require('mongoose');
const SolarPointSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  battery_soc: { type: Number },		// percent
  battery_voltage: { type: Number },		// volts
  battery_charging_amps: { type: Number },	// amps
  battery_temperature: { type: Number },	// celcius
  controller_temperature: { type: Number },	// celcius
  load_voltage: { type: Number, default: 0 },	// volts
  load_amps: { type: Number, default: 0 },	// amps
  load_watts: { type: Number, default: 0 },	// watts
  solar_panel_voltage: { type: Number },	// volts
  solar_panel_amps: { type: Number },		// amps
  solar_panel_watts: { type: Number },		// watts

  min_battery_voltage_today: { type: Number },	// volts
  max_battery_voltage_today: { type: Number },	// volts
  max_charging_amps_today: { type: Number },	// amps
  max_discharging_amps_today: { type: Number },	// amps
  max_charge_watts_today: { type: Number },	// watts
  max_discharge_watts_today: { type: Number },	// watts
  charge_amphours_today: { type: Number },	// amp hours
  discharge_amphours_today: { type: Number },	// amp hours
  charge_watthours_today: { type: Number },	// watt hours
  discharge_watthours_today: { type: Number },	// watt hours
  controller_uptime_days: { type: Number },	// days
  total_battery_overcharges: { type: Number },	// count
  total_battery_fullcharges: { type: Number },	// count

  // convenience values
  battery_temperatureF: { type: Number },	// fahrenheit
  controller_temperatureF: { type: Number },	// fahrenheit
  battery_charging_watts: { type: Number },	// watts. necessary? Does it ever differ from solar_panel_watts?
  last_update_time: { type: Date },		// millis() of last update time
  controller_connected: { type: Boolean },	// bool if we successfully read data from the controller
  
});
module.exports = mongoose.model('SolarPoint', SolarPointSchema);
