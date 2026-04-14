import { MessageView, Presenter } from "./Presenter";

export interface LoadingMessageView extends MessageView {
  setIsLoading: (value: boolean) => void;
}

export abstract class LoadingMessagePresenter<
  V extends LoadingMessageView,
> extends Presenter<V> {
  protected async doFailureReportingOperationWithMessage(
    operation: () => Promise<void>,
    operationDescription: string,
    infoMessage: string,
  ) {
    let messageId = "";

    this.view.setIsLoading(true);

    try {
      messageId = this.view.displayInfoMessage(infoMessage, 0);

      await this.doFailureReportingOperation(async () => {
        await operation();
      }, operationDescription);
    } finally {
      this.view.deleteMessage(messageId);
      this.view.setIsLoading(false);
    }
  }
}
