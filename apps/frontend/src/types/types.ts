export interface Zap {
  id: string;
  triggerId: string;
  userId: number;

  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };

  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}

export interface AvailableAction {
  id: string;
  name: string;
  image: string;
}

export interface AvailableTrigger {
  id: string;
  name: string;
  image: string;
}
