from typing import Any, Literal

SortDirection = Literal["ASC", "DESC"]

class QueryBuilder:
    def __init__(self, columns: list[str], table: str, id_field: str) -> None:
        self._id_field = id_field
        self._query = None
        self._clauses = [f"SELECT {', '.join(columns)} FROM {table}"]
        self._filters = []
        self._order_by = None
        self._limit = None

        self._args = []
        self._arg_num = 1
    
    def add_equality_filter(self, field_name: str, value: Any) -> None:
        self._filters.append(f"{field_name} = ${self._arg_num}")
        self._args.append(value)
        self._arg_num += 1
    
    def add_range_filter(self, field_name: str, field_min: Any, field_max: Any) -> None:
        if field_min is not None and field_max is not None:
            self._filters.append(f"{field_name} BETWEEN ${self._arg_num} and ${self._arg_num + 1}")
            self._args.append(field_min)
            self._args.append(field_max)
            self._arg_num += 2
        elif field_min is not None:
            self._filters.append(f"{field_name} >= ${self._arg_num}")
            self._args.append(field_min)
            self._arg_num += 1
        elif field_max is not None:
            self._filters.append(f"{field_name} <= ${self._arg_num}")
            self._args.append(field_max)
            self._arg_num += 1
    
    def add_membership_filter(self, field_name: str, values: list[Any], from_table: str | None = None) -> None:
        arg_list = [f"${self._arg_num + i}" for i in range(len(values))]
        if from_table is None:
            self._filters.append(f"{field_name} IN ({', '.join(arg_list)})")
        else:
            self._filters.append(f"{self._id_field} IN (SELECT {self._id_field} FROM {from_table} WHERE {field_name} IN ({', '.join(arg_list)}))")
        self._args.extend(values)
        self._arg_num += len(values)
    
    def add_order_by(self, field: str, direction: SortDirection) -> None:
        self._order_by = f"ORDER BY {field} {direction} NULLS LAST"
    
    def add_limit(self, limit: int) -> None:
        self._limit = f"LIMIT {limit}"
    
    def build(self) -> tuple[str, list[Any]]:
        if self._filters:
            self._clauses.append("WHERE " + " AND ".join(self._filters))
        if self._order_by is not None:
            self._clauses.append(self._order_by)
        if self._limit is not None:
            self._clauses.append(self._limit)
        return " ".join(self._clauses), self._args
