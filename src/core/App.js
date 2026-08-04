const App = {
    start() {
        Storage.initialize();
        Router.registrar({
            dashboard: DashboardView,
            registro: RegistroWizardView,
            michis: MichisListView,
            backup: BackupView
        });
        Router.iniciar();
    }
};
