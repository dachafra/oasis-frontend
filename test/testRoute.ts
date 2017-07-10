import { expect } from 'chai';
import {Route} from "../src/app/classes/Route";
import {Connection} from "../src/app/classes/Connection";

/* Constructor test */
describe('Route.ts constructor', () => {
  it('object should be created', () => {
    let route = new Route();
  });
});

/* Connections test */
describe('Route.ts connections', () => {
  it('Connection should be added to array connections', () => {
    // setup
    const dummyjson = '{"@id": "#1499679000000881434088____%3A007%3A%3A8841004%3A8884335%3A52%3A1247%3A20170710","@type": "Connection","departureStop": "http://irail.be/stations/NMBS/008814340","arrivalStop": "http://irail.be/stations/NMBS/008814357","departureTime": "2017-07-10T09:30:00.000Z","arrivalTime": "2017-07-10T09:30:00.000Z","gtfs:trip": "http://irail.be/trips/88____%3A007%3A%3A8841004%3A8884335%3A52%3A1247%3A20170710","gtfs:route": "http://irail.be/routes/51"}';
    const json = JSON.parse(dummyjson);
    const c = new Connection(json);
    let route = new Route();
    // assertion
    expect(route.connections.length).to.equal(0);
    // execution
    route.connections.push(c);
    // assertion
    expect(route.connections.length).to.equal(1);

  });
});

/* QoE test */
describe('Route.ts getQoE()', () => {
  it('Should return 0', () => {
    // setup
    const dummyjson = '{"@id": "#1499679000000881434088____%3A007%3A%3A8841004%3A8884335%3A52%3A1247%3A20170710","@type": "Connection","departureStop": "http://irail.be/stations/NMBS/008814340","arrivalStop": "http://irail.be/stations/NMBS/008814357","departureTime": "2017-07-10T09:30:00.000Z","arrivalTime": "2017-07-10T09:40:00.000Z","gtfs:trip": "http://irail.be/trips/88____%3A007%3A%3A8841004%3A8884335%3A52%3A1247%3A20170710","gtfs:route": "http://irail.be/routes/51"}';
    const json = JSON.parse(dummyjson);
    const c = new Connection(json);
    let route = new Route();
    route.connections.push(c);
    // assertion
    expect(route.getQoE()).to.equal(0);

  });
});