import { configure } from 'mobx';

// Configuração do MobX
configure({
  enforceActions: 'never', // Mais permissivo para desenvolvimento
  computedRequiresReaction: false, // Mais permissivo para desenvolvimento
  reactionRequiresObservable: false, // Mais permissivo para desenvolvimento
  observableRequiresReaction: false, // Mais permissivo para desenvolvimento
  disableErrorBoundaries: true, // Desabilitar error boundaries para desenvolvimento
  useProxies: 'ifavailable' // Usar proxies quando disponível
});
