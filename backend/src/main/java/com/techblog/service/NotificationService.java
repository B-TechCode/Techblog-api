package com.techblog.service;

import com.techblog.entity.Notification;
import com.techblog.entity.User;
import com.techblog.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void send(User user, String message) {

        Notification n = new Notification();

        n.setReceiver(user);

        n.setMessage(message);

        repo.save(n);

        // ✅ REAL-TIME PUSH

        messagingTemplate.convertAndSend(
                "/topic/notifications/" + user.getId(),
                message
        );
    }

    public List<Notification> get(User user) {

        return repo.findByReceiverOrderByCreatedAtDesc(user);
    }
}