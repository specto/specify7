'use strict';

import * as app from './specifyapp';
import router from './router';
import NotFoundView from './notfoundview';
import commonText from './localization/common';

export default function () {
  router.route('workbench-plan/:id/', 'workbench-plan', (id) => {
    Promise.allSettled(
      import('./components/wbplanview'),
      fetch(`/api/workbench/dataset/${id}/`)
    ).then(([{ default: WbPlanView }, response]) => {
      if (response.status === 404) {
        app.setCurrentView(new NotFoundView());
        app.setTitle(commonText('pageNotFound'));
      } else
        response
          .json()
          .then((dataset) =>
            app.setCurrentView(new WbPlanView({ dataset: dataset }))
          );
    });
  });
};
