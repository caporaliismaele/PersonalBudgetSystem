using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PlannedTransactionWorker.Class
{
    internal class WorkerState
    {
        public DateTime LastRunDate { get; set; }

        public static class WorkerStateManager
        {
            private const string FilePath = "last-run.json";

            public static WorkerState Load()
            {
                if (!File.Exists(FilePath))
                    return new WorkerState { LastRunDate = DateTime.MinValue };

                var json = File.ReadAllText(FilePath);
                return JsonSerializer.Deserialize<WorkerState>(json);
            }

            public static void Save(DateTime date)
            {
                var state = new WorkerState { LastRunDate = date };
                var json = JsonSerializer.Serialize(state);
                File.WriteAllText(FilePath, json);
            }
        }

    }
}
