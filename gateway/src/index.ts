import Manager from './ws/Manager';

const manager = new Manager();
(async () => {
  await manager.fetchGateway();
  manager.spawn();
})();
