import sensor from '@ohos.sensor';
import qtsensorsplugin from 'libplugins_sensors_qtsensors_openharmony.so';

export class QtSensors {
  private pointerId = 0;

  public constructor(id) {
    this.pointerId = id;
  }

  /* Hz转ns,周期为1 */
  private hertz2ns(rate: Number) {
    /* f=1/T （其中f是指赫兹,T是指以秒为单位的时间）*/
    let ns = (1 / Number(rate)) * 1000000000;
    return ns;
  }

  /* ns转Hz,周期为1 */
  private ns2hertz(ns: Number) {
    /* f=1/T （其中f是指赫兹,T是指以秒为单位的时间）*/
    let hz = 1 / (Number(ns) / 1000000000);
    return hz;
  }

  createSensor(name, p) {
    let server = new QtSensors(p);
    Reflect.defineProperty(globalThis, name, { value: server });
    return true;
  }

  destroySensor(name: string) {
    Reflect.deleteProperty(globalThis, name);
    this.pointerId = 0;
    return true;
  }

  /* 获取所有传感器类型Id */
  async sensorIds() {
    let s: Array<String> = new Array();
    try {
      let sr = await sensor.getSensorList();
      for (let data of sr) {
        s.push(String(data.sensorId));
      }
    } catch (e) {
      console.error(`Failed to get sensorList. Code: ${e.code}, message: ${e.message}`);
    }
    return s;
  }

  stop(type: sensor.SensorId) {
    try {
      sensor.off(Number(type));
    } catch (error) {
      console.error(`Failed to invoke off. Code: ${error.code}, message: ${error.message}`);
    }
  }

  /* 开始订阅传感器数据 */
  async start(type: sensor.SensorId, rate: Number) {
    try {
      this.stop(type);
      let ns = this.hertz2ns(rate);
      let max = await this.maxSamplePeriod(type);
      let min = await this.minSamplePeriod(type);
      let iv = Math.max(Math.min(max, ns), min);

      sensor.on(Number(type), (data) => {
        qtsensorsplugin.DataAcception(this.pointerId, JSON.stringify(data));
      }, { interval: iv });
    } catch (error) {
      console.error(`Failed to invoke on. Code: ${error.code}, message: ${error.message}`);
    }
  }

  /* 获取指定传感器信息 */
  async description(type: sensor.SensorId) {
    try {
      let info = await sensor.getSingleSensor(type);
      let des = JSON.stringify(info);
      console.info('Succeeded in getting sensor: ' + des);
      return des;
    } catch (e) {
      console.error(`Failed to get singleSensor . Code: ${e.code}, message: ${e.message}`);
    }
  }

  async sensorName(type: sensor.SensorId) {
    let s = await sensor.getSingleSensor(type);
    return s.sensorName;
  }

  async vendorName(type: sensor.SensorId) {
    let s = await sensor.getSingleSensor(type);
    return s.vendorName;
  }

  async firmwareVersion(type: sensor.SensorId) {
    let s = await sensor.getSingleSensor(type);
    return s.firmwareVersion;
  }

  async hardwareVersion(type: sensor.SensorId) {
    let s = await sensor.getSingleSensor(type);
    return s.hardwareVersion;
  }

  async maxRange(type: sensor.SensorId) {
    let s = await sensor.getSingleSensor(type);
    return s.maxRange;
  }

  async minSamplePeriod(type: sensor.SensorId) {
    let s = await sensor.getSingleSensor(type);
    return this.ns2hertz(s.minSamplePeriod);
  }

  async maxSamplePeriod(type: sensor.SensorId) {
    let s = await sensor.getSingleSensor(type);
    return this.ns2hertz(s.minSamplePeriod);
  }

  async precision(type: sensor.SensorId) {
    let s = await sensor.getSingleSensor(type);
    return s.precision;
  }

  async power(type: sensor.SensorId) {
    let s = await sensor.getSingleSensor(type);
    return s.minSamplePeriod;
  }
}