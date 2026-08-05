const App = {
    start() {
        Storage.initialize();
        Router.registrar({
            dashboard: DashboardView,
            registro: RegistroWizardView,
            michis: MichisListView,
            backup: BackupView
        });

        if (Auth.estaDesbloqueado()) {
            Router.iniciar();
        } else {
            LoginView.render(() => Router.iniciar());
        }
    }
};
