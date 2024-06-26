import { autoUpdater } from "electron-updater";
import { inject, injectable } from "inversify";
import { TYPES } from "../types.ts";
import isDev from "electron-is-dev";
import ElectronLogger from "./ElectronLogger.ts";
import { Vendor } from "../core/vendor.ts";
import ElectronStore from "electron-store";

@injectable()
export default class UpdateService implements Vendor {
  constructor(
    @inject(TYPES.ElectronLogger)
    private readonly logger: ElectronLogger,
    @inject(TYPES.ElectronStore)
    private readonly store: ElectronStore
  ) {}

  async init() {
    if (isDev) return;

    const { autoUpgrade } = this.store.store;
    if (!autoUpgrade) return;

    try {
      autoUpdater.disableWebInstaller = true;
      autoUpdater.logger = this.logger.logger;
      autoUpdater.allowPrerelease = false;
      await autoUpdater.checkForUpdatesAndNotify({
        title: "自动更新完成",
        body: "下次重启时将会自动安装",
      });
    } catch (e) {
      this.logger.info("update error", e);
    }
  }
}
