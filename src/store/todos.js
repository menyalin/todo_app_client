/* eslint-disable no-unused-vars */
import moment from "moment";
const dateFormat = "YYYY-MM-DD";

const setTodoDays = (baseDate = "", dayCount = 1) => {
  let resArr = [];
  let prevDays;
  switch (true) {
    case dayCount <= 5:
      prevDays = -2;
      break;
    default:
      prevDays = -3;
  }
  const tmpDate = moment(baseDate);
  tmpDate.add(prevDays, "day");
  for (let i = 0; i < dayCount; i++) {
    resArr.push({
      date: tmpDate.add(1, "day").format(dateFormat),
    });
  }
  return resArr;
};

export default {
  state: {
    isFormOfTaskVisible: false,
    slideDirection: null,
    moveableTaskId: null,
    currentDate: moment(),
    todosDays: [],
    tasks: [
      {
        id: 1,
        date: "2021-05-06",
        content: "сделать список задач",
        completed: false,
        order: 0,
      },
      {
        id: 2,
        date: "2021-05-06",
        content: "сделать верстку списка",
        completed: false,
        order: 1,
      },
      {
        id: 3,
        date: "2021-05-06",
        content: "сделать заголовок дня",
        completed: false,
        order: 2,
      },
      {
        id: 4,
        date: "2021-05-06",
        content: "подключить локализацию",
        completed: false,
        order: 3,
      },
      {
        id: 5,
        date: "2021-05-06",
        content: "очередная задача 1",
        completed: false,
        order: 4,
      },
      {
        id: 6,
        date: "2021-05-06",
        content: "очередная задача 2",
        completed: false,
        order: 5,
      },
      {
        id: 7,
        date: "2021-05-06",
        content:
          "Очень очень длинный текст, какой-то очень сложной, практически не выполнимой задачи",
        completed: false,
        order: 6,
      },
    ],
  },
  mutations: {
    initTodoDays(state, count) {
      state.todosDays = setTodoDays(state.currentDate, count);
    },
    shiftDate(state, { count, slides }) {
      console.log("slides: ", slides);
      if (count > 0) state.slideDirection = "right";
      else state.slideDirection = "left";

      state.currentDate.add(count, "day");

      state.todosDays = setTodoDays(
        state.currentDate.format(dateFormat),
        slides
      );
    },
    setDate(state, { newDate, slides }) {
      if (!newDate) newDate = moment().format(dateFormat);

      if (state.currentDate.isAfter(newDate, "day"))
        state.slideDirection = "left";
      else if (state.currentDate.isBefore(newDate, "day"))
        state.slideDirection = "right";

      state.currentDate = moment(newDate);
      state.todosDays = setTodoDays(
        state.currentDate.format(dateFormat),
        slides
      );
    },
    addTask({ tasks }, newTask) {
      tasks.push(newTask);
    },
    removeTask(state, taskId) {
      state.tasks = state.tasks.filter((item) => item.id !== taskId);
    },
    updateTaskContent({ tasks }, { id, content }) {
      const tmp = tasks.find((item) => item.id === id);
      tmp.content = content;
    },
    editTaskDate({ tasks }, { id, date, order }) {
      let editableTask = tasks.find((item) => item.id === id);
      editableTask.date = date;
      editableTask.order = order;
    },
    setMoveableTaskId(state, payload) {
      state.moveableTaskId = payload;
    },
    reorderTaskInDay(state, updatedArray) {
      const ids = updatedArray.map((item) => item.id);
      state.tasks = state.tasks.filter((item) => !ids.includes(item.id));
      state.tasks.push(...updatedArray);
    },
    changeTaskStatus(state, task) {
      let editableTask = state.tasks.find((item) => item.id === task.id);
      editableTask = task;
    },
    openTaskForm(state) {
      state.isFormOfTaskVisible = true;
    },
    closeTaskForm(state) {
      state.isFormOfTaskVisible = false;
    },
  },
  actions: {
    initTodoDays({ commit }, count) {
      commit("initTodoDays", count);
    },
    addTask({ commit, getters }, { content, date }) {
      const lastIndex = getters.lastIndexInDay(date);
      const order = lastIndex !== -Infinity ? lastIndex + 1 : 0;

      const newTask = {
        id: "id" + new Date().getTime(),
        date,
        content,
        completed: false,
        order,
      };
      commit("addTask", newTask);
    },
    removeTask({ commit }, taskId) {
      commit("removeTask", taskId);
    },
    updateTaskContent({ commit }, { id, content }) {
      if (id) {
        commit("updateTaskContent", { id, content });
      }
    },
    editTaskDate({ commit, getters }, payload) {
      const lastIndex = Math.max(
        ...getters.getDayTasks(payload.date).map((item) => item.order)
      );
      payload.order = lastIndex !== -Infinity ? lastIndex + 1 : 0;
      commit("editTaskDate", payload);
    },
    reorderTaskInDay({ commit, getters }, { targetDate, taskId, targetOrder }) {
      const movedTask = getters.allTasks.find((item) => item.id === taskId);
      let tmpArr = getters.getDayTasks(targetDate);
      let resArr = [];
      let ord = 0;
      if (!movedTask) return;
      if (movedTask.date !== targetDate || movedTask.order !== targetOrder) {
        movedTask.date = targetDate;
        for (let i = 0; i < tmpArr.length; i++) {
          if (tmpArr[i].order === targetOrder) {
            resArr.push({ ...movedTask, order: ord++ });
            resArr.push({ ...tmpArr[i], order: ord++ });
          } else if (taskId !== tmpArr[i].id) {
            resArr.push({ ...tmpArr[i], order: ord++ });
          }
        }
        commit("reorderTaskInDay", resArr);
      }
    },
    changeTaskStatus({ commit, getters }, { taskId, status }) {
      let updatedTask = getters.taskById(taskId);
      if (!updatedTask) throw new Error("Task not found");
      if (status === true) {
        updatedTask.order = getters.lastIndexInDay(updatedTask.date) + 1;
      }
      updatedTask.completed = status;
      commit("changeTaskStatus", updatedTask);
    },
  },
  getters: {
    isFormOfTaskVisible: ({ isFormOfTaskVisible }) => isFormOfTaskVisible,

    currentDate: ({ currentDate }) => currentDate,

    todosDays: ({ todosDays }) => todosDays,

    moveableTaskId: ({ moveableTaskId }) => moveableTaskId,

    slideDirection: ({ slideDirection }) => slideDirection,

    allTasks: ({ tasks }) => tasks,

    getDayTasks: (state) => (date) =>
      state.tasks
        .filter((item) => item.date === date)
        .sort((a, b) => a.order - b.order),

    lastIndexInDay: (state) => (date) =>
      Math.max(
        ...state.tasks
          .filter((task) => task.date === date)
          .map((task) => task.order)
      ),

    taskById: (state) => (id) => state.tasks.find((item) => item.id === id),
  },
};
