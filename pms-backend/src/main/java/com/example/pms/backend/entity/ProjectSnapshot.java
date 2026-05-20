package com.example.pms.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "project_snapshots",
        uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "snapshot_date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "snapshot_date", nullable = false)
    private LocalDate snapshotDate;

    @Column(name = "total_tasks", nullable = false)
    @Builder.Default
    private Integer totalTasks = 0;

    @Column(name = "completed_tasks", nullable = false)
    @Builder.Default
    private Integer completedTasks = 0;

    @Column(name = "overdue_tasks", nullable = false)
    @Builder.Default
    private Integer overdueTasks = 0;

    @Column(name = "remaining_tasks", nullable = false)
    @Builder.Default
    private Integer remainingTasks = 0;

    @Column(name = "completion_rate", nullable = false)
    @Builder.Default
    private Float completionRate = 0f;
}
