class Scheduler {
  constructor(maxPerInterval, interval, id) {
    this.id = id;
    this._startTime = 0;
    this.maxPerInterval = maxPerInterval;
    this.interval = interval;
    this.queueRunning = false;
    this.queue = [];
  }

  addInterval() {}

  counts() {
    return this.queue.length;
  }

  startInterval(scheduler) {
    if (scheduler.queueRunning == false) {
      scheduler.queueRunning = true;
    }
    const intervalStartTime = Date.now();
    let count = 0;
    console.log(
      "Scheduler " +
        scheduler.id +
        " started on: " +
        new Date(intervalStartTime).toString()
    );

    console.log("Scheduler: starting more jobs...");
    const loop = setInterval(() => {
      // Get job on queue
      let job = makeFunction(scheduler._dequeue());

      // Execute job
      if (job) {
        job();
        count++;
      }
      // If was schedule empty, stop.
      else {
        console.log("Scheduler: cleared...");
        clearInterval(loop);
      }

      //Check for wait condition
      console.log("Consumed");
      if (count == scheduler.maxPerInterval) {
        console.log("maxed reached...");
        const scheduler_ = scheduler;
        let timeTaken = Date.now() - intervalStartTime;
        console.log("taken " + timeTaken + "ms");
        console.log("wating for  " + (5000 - timeTaken) + "ms");
        setTimeout(() => {
          scheduler_.startInterval(scheduler_);
        }, 5000 - timeTaken);
        count = 0;
        clearInterval(loop);
      }
    }, scheduler.interval);
  }

  enqueue(fn, ...argsArray) {
    // console.log(argsArray);
    this.queue.push({ function: fn, args: argsArray });
    if (!this.queueRunning) {
      console.log("UH!OH!");
      this.startInterval(this);
    }
  }

  _dequeue() {
    return this.queue.shift();
  }

  _conditions(startTime) {
    return true;
  }
}

function makeFunction(callbackWrapper) {
  if (callbackWrapper) {
    let fn = callbackWrapper.function,
      args = callbackWrapper.args;
    if (args.length !== fn.length) {
      console.log(`Warning, function ${fn.name} takes ${fn.length} arguments.`);
      return undefined;
    }
    let job = fn.bind(this, ...args);
    return job;
  }
  return undefined;
}

module.exports = Scheduler;
