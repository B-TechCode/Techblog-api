package com.techblog.repository;

import com.techblog.entity.Notification;
import com.techblog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);
}