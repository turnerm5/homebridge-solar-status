var fs = require('fs');
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-solar-status", "SolarSensor", LightSensorAccessory);
}

function LightSensorAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.filePath = config["file_path"];

  this.service = new Service.LightSensor(this.name);

  this.service
    .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
    .setProps({
      minValue: 0,
      maxValue: 100,
      minStep: 0.01,
    })
    .on('get', this.getState.bind(this));
}

LightSensorAccessory.prototype.getState = function(callback) {
  fs.readFile(this.filePath, 'utf8', function(err, data) {
    if (err) {
      callback(err);
      return
    }

    callback(null, parseFloat(data))
  })
}

LightSensorAccessory.prototype.getServices = function() {
  return [this.service];
}
