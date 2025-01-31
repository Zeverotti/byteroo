import SimpleStorage, { Container } from '../src';
import { constants } from '../src/constants';
import makeid from '../src/utils/makeid';
import { rm, existsSync } from 'fs';
import path from 'path';

describe('test SimpleStorage', () => {
  it('write string value', async () => {
    const storage = new SimpleStorage({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    const testvalues = { key: makeid(8), value: makeid(8) };
    container.set(testvalues.key, testvalues.value);
    await container.commit();
    expect(container.get(testvalues.key)).toBe(testvalues.value);
  });
  it('test commit function', async () => {
    const storage = new SimpleStorage({
      name: makeid(8),
      path: makeid(8),
    });
    const containerName = makeid(8);
    const container = await storage.getContainer(containerName);
    container.set(makeid(8), makeid(8));
    await container.commit();
    expect(existsSync(path.join(storage.path, containerName))).toBe(true);
    rm(storage.path, { recursive: true, force: true }, () => {});
  });
  it('test getContainerSync', () => {
    const storage = new SimpleStorage({
      name: makeid(8),
      path: makeid(8),
    });
    const containerName = makeid(8);
    const container = storage.getContainerSync(containerName);
    expect(container).toBeInstanceOf(Container);
  });
  it('test automatic storage path detection', async () => {
    const storage = new SimpleStorage({
      name: makeid(8),
    });
    const containerName = makeid(8);
    const container = await storage.getContainer(containerName);
    container.set(makeid(8), makeid(8));
    await container.commit();
    expect(existsSync(storage.path)).toBe(true);
    rm(storage.path, { recursive: true, force: true }, () => {});
  });
  it('test remove method of container', async () => {
    const storage = new SimpleStorage({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    const testvalues = { key: makeid(8), value: makeid(8) };
    container.set(testvalues.key, testvalues.value);
    container.remove(testvalues.key);
    expect(container.get(testvalues.key)).toBeUndefined();
  });
  it('test has method of container', async () => {
    const storage = new SimpleStorage({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    const randomProperty = makeid(8);
    expect(container.has(randomProperty)).toBe(false);
    container.set(randomProperty, makeid(8));
    expect(container.has(randomProperty)).toBe(true);
  });
  it('test clear method of container', async () => {
    const storage = new SimpleStorage({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    container.set('property1', 'value1');
    container.set('property2', 'value2');
    container.clear();

    expect(container.get('property1')).toBeUndefined();
    expect(container.get('property2')).toBeUndefined();
  });
  it('test size method of container', async () => {
    const storage = new SimpleStorage({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    container.set('property1', 'value1');
    container.set('property2', 'value2');
    expect(container.size()).toBe(2);
  });
  it('test list method of container', async () => {
    const storage = new SimpleStorage({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    container.set('property1', 'value1');
    container.set('property2', 'value2');
    expect(container.list()[0]).toBe('property1');
    expect(container.list()[1]).toBe('property2');
  });
  it('test rest parameters in remove method', async () => {
    const storage = new SimpleStorage({
      name: makeid(8),
      path: constants.IN_MEMORY_STORAGE,
    });
    const container = await storage.getContainer(makeid(8));
    container.set('property1', 'value1');
    container.set('property2', 'value2');
    container.remove('property1', 'property2');
    expect(container.list().length).toBe(0);
  });
});
