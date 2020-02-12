
import APATE from '../apate';
import Injector from './injector';
import Datastore from '../stores/datastore';
import Settings from '../stores/settings';

APATE.namespace('APATE.utils');


APATE.utils.InjectorManager = (function moduleManager() {

    /**
     * initialize modules
     * register modules with the injector
     */
    Injector.register('settings', new Settings());
    Injector.register('documentStore', new Datastore('APATE.programs'));

}());

export default APATE.utils.InjectorManager;
